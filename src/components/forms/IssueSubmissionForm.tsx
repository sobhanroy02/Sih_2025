import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useSupabase } from '@/contexts/SupabaseProvider'
import { classifyImage } from '@/utils/imageClassification'

interface IssueFormData {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  location: {
    latitude: number
    longitude: number
  } | null
  address: string
}

const IssueSubmissionForm = () => {
  const router = useRouter()
  const supabase = useSupabase()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [classificationConfidence, setClassificationConfidence] = useState<number | null>(null)
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    category: 'infrastructure',
    priority: 'medium',
    location: null,
    address: ''
  })

  // Handle image selection and classification
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        toast.error('Please upload only JPEG or PNG images')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setSelectedImage(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      try {
        // Show loading state
        toast.loading('Analyzing image...')
        
        // Classify the image using ML model
        const classification = await classifyImage(file)
        
        if (classification) {
          // Update form with ML predictions
          setFormData(prev => ({
            ...prev,
            title: classification.suggestedTitle,
            category: classification.category,
            // Set priority based on category and confidence
            priority: classification.category === 'safety' || classification.confidence > 0.8 ? 'high' : 'medium'
          }))

          // Store confidence score
          setClassificationConfidence(classification.confidence)

          // Dismiss loading and show success
          toast.dismiss()
          toast.success(
            <div>
              <p><strong>Issue Detected!</strong></p>
              <p>Type: {classification.originalLabel}</p>
              <p>Confidence: {Math.round(classification.confidence * 100)}%</p>
              <p>Category: {classification.category}</p>
            </div>
          )
        }
      } catch (error) {
        toast.dismiss()
        toast.error('Could not analyze image. Please select category manually.')
      }
    }
  }

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }))
          // Reverse geocode to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(res => res.json())
            .then(data => {
              setFormData(prev => ({
                ...prev,
                address: data.display_name
              }))
            })
            .catch(() => {
              toast.error('Failed to get address')
            })
        },
        () => {
          toast.error('Failed to get location')
        }
      )
    }
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.location || !formData.address) {
      toast.error('Please add your location')
      return
    }

    try {
      setIsSubmitting(true)

      // First check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        toast.error('Please login to submit an issue')
        router.push('/login')
        return
      }

      // 1. Upload image to Supabase Storage
      const attachments = []
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop()
        const fileName = `${user.id}_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('issue-images')
          .upload(`public/${fileName}`, selectedImage)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error('Failed to upload image')
        }

        // Get public URL for the uploaded file
        const { data: publicUrl } = supabase.storage
          .from('issue-images')
          .getPublicUrl(`public/${fileName}`)

        if (publicUrl) {
          attachments.push({
            file_url: publicUrl.publicUrl,
            file_type: 'image',
            file_size: selectedImage.size,
            metadata: {
              originalName: selectedImage.name,
              description: 'Issue evidence image'
            }
          })
        }
      }

      // 2. Create issue in database
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority.toLowerCase(),
          location: {
            latitude: formData.location.latitude,
            longitude: formData.location.longitude
          },
          address: formData.address,
          attachments: attachments
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit issue')
      }

      // 3. Show success message
      toast.success('Issue submitted successfully!')

      // 4. Clear form
      setFormData({
        title: '',
        description: '',
        category: 'infrastructure',
        priority: 'medium',
        location: null,
        address: ''
      })
      setSelectedImage(null)
      setImagePreview(null)
      setClassificationConfidence(null)

      // 5. Redirect to dashboard
      router.push(`/issue/${data.issue.id}`)
      router.refresh()

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit issue'
      toast.error(errorMessage)
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Issue Title {selectedImage && formData.title && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Auto-generated
              </span>
            )}
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Brief title describing the issue"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Detailed description of the issue"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category {selectedImage && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                AI Suggested {classificationConfidence !== null && (
                  <span className="ml-1 text-blue-700">
                    ({Math.round(classificationConfidence * 100)}%)
                  </span>
                )}
              </span>
            )}
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="infrastructure">Infrastructure</option>
            <option value="sanitation">Sanitation</option>
            <option value="transportation">Transportation</option>
            <option value="safety">Safety</option>
            <option value="environment">Environment</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as IssueFormData['priority'] }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Upload Image (JPEG/PNG only)
          </label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-2 relative h-48 w-full">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <Button
            type="button"
            onClick={getCurrentLocation}
            className="mb-4"
            variant="outline"
          >
            Get Current Location
          </Button>
          {formData.address && (
            <p className="text-sm text-gray-600">
              Location: {formData.address}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </div>
        ) : (
          'Submit Issue'
        )}
      </Button>
    </form>
  )
}

export default IssueSubmissionForm
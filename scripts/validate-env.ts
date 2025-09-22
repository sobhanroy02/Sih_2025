// Environment validation utility for CitiZen application
// This ensures all required environment variables are properly configured

interface RequiredEnvVars {
  [key: string]: {
    required: boolean;
    description: string;
    validation?: RegExp;
    example?: string;
  };
}

const envConfig: RequiredEnvVars = {
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    validation: /^https:\/\/.+\.supabase\.co$/,
    example: 'https://your-project.supabase.co'
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    description: 'Supabase anon public key',
    validation: /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    description: 'Supabase service role key (server-side only)',
    validation: /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },

  // JWT Configuration
  JWT_SECRET: {
    required: true,
    description: 'JWT signing secret (minimum 32 characters)',
    validation: /^.{32,}$/,
    example: 'your-super-secret-jwt-key-minimum-32-characters-long'
  },

  // Application Configuration
  NEXT_PUBLIC_APP_URL: {
    required: true,
    description: 'Application base URL',
    validation: /^https?:\/\/.+/,
    example: 'http://localhost:3000'
  },

  // Optional but recommended
  UPLOAD_MAX_SIZE: {
    required: false,
    description: 'Maximum file upload size in bytes',
    validation: /^\d+$/,
    example: '10485760'
  },

  // Email Configuration (optional)
  SMTP_HOST: {
    required: false,
    description: 'SMTP server host',
    example: 'smtp.gmail.com'
  },
  SMTP_PORT: {
    required: false,
    description: 'SMTP server port',
    validation: /^\d+$/,
    example: '587'
  },
  SMTP_USER: {
    required: false,
    description: 'SMTP username/email',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    example: 'your-email@gmail.com'
  },
  SMTP_PASS: {
    required: false,
    description: 'SMTP password/app password',
    example: 'your-app-password'
  }
};

class EnvironmentValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  validate(): { isValid: boolean; errors: string[]; warnings: string[] } {
    this.errors = [];
    this.warnings = [];

    for (const [key, config] of Object.entries(envConfig)) {
      const value = process.env[key];

      if (config.required && !value) {
        this.errors.push(`Missing required environment variable: ${key}`);
        this.errors.push(`  Description: ${config.description}`);
        if (config.example) {
          this.errors.push(`  Example: ${config.example}`);
        }
        continue;
      }

      if (value && config.validation && !config.validation.test(value)) {
        this.errors.push(`Invalid format for environment variable: ${key}`);
        this.errors.push(`  Description: ${config.description}`);
        if (config.example) {
          this.errors.push(`  Expected format: ${config.example}`);
        }
      }

      if (!config.required && !value) {
        this.warnings.push(`Optional environment variable not set: ${key}`);
        this.warnings.push(`  Description: ${config.description}`);
      }
    }

    // Additional custom validations
    this.validateCustomRules();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  private validateCustomRules(): void {
    // Check if SMTP configuration is complete or completely missing
    const smtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const smtpSet = smtpVars.filter(key => process.env[key]);
    
    if (smtpSet.length > 0 && smtpSet.length < smtpVars.length) {
      this.warnings.push('Incomplete SMTP configuration. Either set all SMTP variables or none.');
      this.warnings.push(`  Missing: ${smtpVars.filter(key => !process.env[key]).join(', ')}`);
    }

    // Validate JWT secret strength
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      this.errors.push('JWT_SECRET must be at least 32 characters long for security');
    }

    // Check for development vs production settings
    if (process.env.NODE_ENV === 'production') {
      if (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')) {
        this.errors.push('NEXT_PUBLIC_APP_URL should not use localhost in production');
      }
    }
  }

  printResults(): void {
    const { isValid, errors, warnings } = this.validate();

    console.log('🔍 Environment Configuration Validation\n');

    if (errors.length > 0) {
      console.log('❌ Errors found:');
      errors.forEach(error => console.log(`   ${error}`));
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   ${warning}`));
      console.log('');
    }

    if (isValid) {
      console.log('✅ Environment configuration is valid!');
      console.log('💡 Your application should start successfully.\n');
    } else {
      console.log('❌ Environment configuration has errors!');
      console.log('💡 Please fix the errors above before starting the application.\n');
      console.log('📖 Check .env.template for configuration examples.');
      console.log('📚 Read SUPABASE_SETUP.md for detailed setup instructions.\n');
      process.exit(1);
    }
  }

  static validateAndExit(): void {
    const validator = new EnvironmentValidator();
    validator.printResults();
  }
}

// Export for use in other files
export default EnvironmentValidator;

// CLI usage - run this file directly to validate environment
if (require.main === module) {
  EnvironmentValidator.validateAndExit();
}
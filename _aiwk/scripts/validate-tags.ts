import { printTagValidationReport } from '../../src/lib/tag-validator'

/**
 * Validate tag consistency across all products
 * Run: npm run validate:tags
 */

console.log('🔍 Validating product tags...\n')

const report = printTagValidationReport()

// Exit with error code if validation fails
if (report.invalidProducts > 0) {
  console.log('\n❌ Tag validation failed. Please fix the errors above.')
  process.exit(1)
} else {
  console.log('\n✅ Tag validation passed!')
  process.exit(0)
}

export class ValidationErrorAdapter {
  static convert(issues: Array<any>): Error {
    return new Error(
      issues
        .map((issue) => `${issue.path.join('.').toUpperCase()}: ${issue.message}`)
        .join(', ')
    );
  }
}

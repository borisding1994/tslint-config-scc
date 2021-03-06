import * as Lint from 'tslint';
import * as ts from 'typescript';

/**
 * A base walker class that gracefully handles unexpected errors.
 * Errors are often thrown when the TypeChecker is invoked.
 */
export class ErrorTolerantWalker extends Lint.RuleWalker {

  public static DEBUG = false;

  protected visitNode(node: ts.Node): void {
    try {
      super.visitNode(node);
    } catch (e) {
      // turn this on when trying out new rules on foreign codebases
      if (ErrorTolerantWalker.DEBUG) {
        const msg = `An error occurred visiting a node.
Walker: ${this.getClassName()}
Node: ${node.getFullText ? node.getFullText() : '<unknown>'}
${e}`;

        this.addFailureAt(
          node.getStart ? node.getStart() : 0,
          node.getWidth ? node.getWidth() : 0,
          msg);
      }
    }
  }

  private getClassName(): string {
    // Some versions of IE have the word "function" in the constructor name and
    // have the function body there as well. This rips out and returns the function name.
    const result: string = this.constructor.toString().match(/function\s+([\w\$]+)\s*\(/)[1] || '';
    if (result == null || result.length === 0) {
      throw new Error(`Could not determine class name from input: ${this.constructor.toString()}`);
    }
    return result;
  }

}

import { Directive, ElementRef, HostListener, Inject } from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
})
export class FocusTrapDirective {
  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  @HostListener('window:focusin', ['$event'])
  public onFocusIn(event: FocusEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
      const walker = document.createTreeWalker(
        this.elementRef.nativeElement,
        NodeFilter.SHOW_ELEMENT
      );
      while (walker.nextNode()) {
        const current = walker.currentNode;
        if (
          current instanceof HTMLElement &&
          isNativeKeyboardFocusable(current)
        ) {
          current.focus();
          return;
        }
      }
    }
  }
}

export function isNativeKeyboardFocusable(element: Element): boolean {
  if (
    element.hasAttribute('disabled') ||
    element.getAttribute('tabIndex') === '-1'
  ) {
    return false;
  }

  // TODO: iframe warning
  if (
    (element instanceof HTMLElement && element.isContentEditable) ||
    element.getAttribute('tabIndex') === '0'
  ) {
    return true;
  }

  switch (element.tagName) {
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;
    case 'VIDEO':
    case 'AUDIO':
      return element.hasAttribute('controls');
    case 'INPUT':
      return element.getAttribute('type') !== 'hidden';
    case 'A':
    case 'LINK':
      return element.hasAttribute('href');
    default:
      return false;
  }
}

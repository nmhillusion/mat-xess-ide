export class FileTabComponent {
  constructor(private element_: HTMLElement, private fileName: string) {
    console.log("init for file tab of ", fileName);
  }

  public get element() {
    return this.element_;
  }
}

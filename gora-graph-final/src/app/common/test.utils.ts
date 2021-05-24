import {ComponentFixture} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';


export class TestUtils<T> {
  fixture: ComponentFixture<T>;
  component: T;
  de: DebugElement;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
    this.component = fixture.componentInstance;
    this.de = fixture.debugElement;
  }

  getElement(selector: string): DebugElement {
    return this.de.query(By.css(selector));
  }

  getElements(selector: string): DebugElement[] {
    return this.de.queryAll(By.css(selector));
  }

  getButtonById(id: string): HTMLButtonElement {
    return this.de.query(By.css(`#${id}`)).nativeElement as HTMLButtonElement;
  }

  clickButtonWithId(id: string): any {
    this.getButtonById(id).click();
  }

  getRandomElementFromArray(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }
}


@Component({template: ''})
export class DummyComponent {
}


export class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open(): any {
    return {
      afterClosed: () => of({data: 'success'})
    };
  }
}

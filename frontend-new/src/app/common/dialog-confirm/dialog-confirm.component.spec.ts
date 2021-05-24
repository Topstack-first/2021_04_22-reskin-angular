import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogConfirmComponent} from './dialog-confirm.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {TestUtils} from '../test.utils';
import {of} from 'rxjs';


describe('DialogConfirmComponent', () => {
  let component: DialogConfirmComponent;
  let fixture: ComponentFixture<DialogConfirmComponent>;
  let helper: Helper;

  let dialogOpenSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({afterClosed: of({})});
  dialogRefSpyObj.componentInstance = {body: ''}; // attach componentInstance to the spy object...

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogConfirmComponent],
      imports: [MatDialogModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmComponent);
    component = fixture.componentInstance;
    helper = new Helper(fixture);

    dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set message to `Jeni të sigurt për këtë veprim?` ', () => {
    expect(component.message).toEqual('Jeni të sigurt për këtë veprim?');
  });

  describe('#openDialog', () => {
    let callback;
    let consoleLogSpy: jasmine.Spy;
    beforeEach(() => {
      callback = (_) => {
        console.log(_);
      };
      consoleLogSpy = spyOn(console, 'log');
      component.openDialog(callback);
    });

    afterEach(() => consoleLogSpy.calls.reset());

    it('should call #dialog.open', () => {
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    });

    it('should open dialog with DialogConfirmComponent and a width of 300px', () => {
      expect(dialogOpenSpy).toHaveBeenCalledWith(DialogConfirmComponent, {width: '300px'});
    });

    it('should cal callback after closed', () => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('should set message to empty string ater closed', () => {
      expect(component.message).toEqual('');
    });
  });

  describe('DOM Tests', () => {
    beforeEach(() => {
    });
    afterEach(() => {
    });

    it('#p tag should show message to the user', () => {
      const paragraphElement: HTMLParagraphElement = helper.getElement('p').nativeElement;

      expect(paragraphElement.innerText).toEqual(component.message);
    });
  });
});


class Helper extends TestUtils<DialogConfirmComponent> {
  fixture: ComponentFixture<DialogConfirmComponent>;

  constructor(fixture: ComponentFixture<DialogConfirmComponent>) {
    super(fixture);
  }
}

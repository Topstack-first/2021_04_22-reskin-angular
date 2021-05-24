import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ArticleService} from '../../_services/article.service';
import {DialogConfirmComponent} from '../../../common/dialog-confirm/dialog-confirm.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {DateAdapter} from '@angular/material/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {ActivatedRoute, Router} from '@angular/router';

export interface Keyword {
  keyword: string;
}

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  providers: [DialogConfirmComponent, {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}]
})
export class ArticleFormComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  id;
  entityId;
  publicationTypes;
  visibilities;
  categories;
  saveInterval;
  loading = false;
  mainImageId = null;
  list = [];

  filteredCategories: Observable<[]>;
  filteredTypes: Observable<[]>;

  files: Array<any>;
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  keywords: Keyword[] = [];


  constructor(private formBuilder: FormBuilder,
              private service: ArticleService,
              private route: ActivatedRoute,
              private router: Router,
              private confirmDialog: DialogConfirmComponent,
              private snackbar: MatSnackBar,
              private location: Location,
              private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in');
    this.id = this.route.snapshot.paramMap.get('id');
    this.entityId = this.route.snapshot.paramMap.get('entityId');

    this.formGroup = this.formBuilder.group({
      draftid: [''],
      title: [''],
      category: [''],
      visibility: [''],
      type: [''],
      abstract: [''],
      content: [''],
      bibliography: [''],
      authorship: this.formBuilder.group({
        creationdate: [''],
        externallink: [''],
        authors: this.formBuilder.array([
          this.initAuthors()
        ])
      })
    });
  }

  ngOnInit(): any {
    this.getCategories();
    this.getPublicationTypes();
    this.getVisibilities();

    if (this.id !== '0') {
      this.service.getDraft(this.entityId, this.id).subscribe(resp => {
        const draft = resp.data[0];
        for (let i = 0; i < draft.authorship.authors.length - 1; i++) {
          this.addAuthor();
        }
        this.formGroup.controls['draftid'].patchValue(this.id);
        this.formGroup.patchValue(draft);
        this.mainImageId = draft.mainimage;
        this.keywords = draft.keywords;
        if (this.mainImageId) {
          this.list = [1];
        }
        this.getFiles();
      });
    } else {
      this.getNewDraftId();
    }

    this.saveInterval = setInterval(() => this.save(), 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.saveInterval);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.keywords.push({keyword: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(keyword: Keyword): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  initAuthors(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      contribution: ['']
    });
  }

  addAuthor(): any {
    const control = this.formGroup.controls['authorship']['controls']['authors'] as FormArray;
    control.push(this.initAuthors());
  }

  removeAuthor(i: number): any {
    const control = this.formGroup.controls['authorship']['controls']['authors'] as FormArray;
    control.removeAt(i);
  }

  _filterCategories(name: string): any {
    const filterValue = name.toLowerCase();
    return this.categories.filter(option => option.cat.toLowerCase().indexOf(filterValue) === 0);
  }

  _filterTypes(name: string): any {
    const filterValue = name.toLowerCase();
    return this.publicationTypes.filter(option => option.type.toLowerCase().indexOf(filterValue) === 0);
  }

  getCategories(): any {
    this.service.getCategories(this.entityId).subscribe(resp => {
      this.categories = resp['data']['categories'];
      this.filteredCategories = this.formGroup.controls['category'].valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.cat),
          map(cat => cat ? this._filterCategories(cat) : this.categories.slice())
        );
    });
  }

  getPublicationTypes(): any {
    this.service.getPublicationTypes(this.entityId).subscribe(resp => {
      this.publicationTypes = resp['data']['types'];
      this.filteredTypes = this.formGroup.controls['type'].valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.type),
          map(type => type ? this._filterTypes(type) : this.publicationTypes.slice())
        );
    });
  }

  getVisibilities(): any {
    this.service.getVisibilities(this.entityId).subscribe(resp => {
      this.visibilities = resp['data']['visibilities'];
    });
  }

  getNewDraftId(): any {
    this.service.getNewDraftId(this.entityId).subscribe(resp => {
      this.formGroup.controls['draftid'].patchValue(resp['data']['newdraftid']);
      // this.getFiles();
    });
  }

  submit(): any {
    if (this.formGroup.valid) {
      const formValues = Object.assign({}, this.formGroup.value);
      formValues['keywords'] = this.keywords;
      // formValues['authorship']['creationdate'] = formatDate(formValues['authorship']['creationdate'], 'dd/MM/yyyy', 'en-in');
      this.service.postDraft(this.entityId, formValues).subscribe(resp => {
        this.confirmDialog.openDialog((value) => {
          if (value) {
            const payload = {draftid: this.formGroup.value.draftid};
            this.service.createArticle(this.entityId, payload).subscribe(() => this.onSuccess(), (error) => this.onError(error));
          }
        });
      });
    }
  }

  save(): any {
    if (this.formGroup.valid) {
      const formValues = Object.assign({}, this.formGroup.value);
      formValues['keywords'] = this.keywords;
      this.service.postDraft(this.entityId, formValues).subscribe(() => null, (error) => this.onError(error));
    }
  }

  handleFileInput(event): any {
    this.loading = true;
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.addFile(this.entityId, formData, this.formGroup.value.draftid).subscribe(() => {
      this.getFiles();
      this.loading = false;
    }, () => {
    });
  }

  handleAbstractFileInput(event): any {
    this.loading = true;
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.addFile(this.entityId, formData, this.formGroup.value.draftid).subscribe(resp => {
      this.selectMainimage(resp.data.fileid);
      if (this.mainImageId) {
        this.removeFile(this.mainImageId);
      }
      this.loading = false;
    }, () => {
    });
  }

  getFiles(): any {
    this.service.getFiles(this.entityId, this.formGroup.value.draftid).subscribe(resp => {
      this.files = resp.data;
      this.files = this.files.filter(obj => obj.id !== this.mainImageId);
    });
  }

  removeFile(fileId): any {
    const data = {fileid: fileId, draftid: this.formGroup.value.draftid};
    this.service.removeFile(this.entityId, data).subscribe(resp => {
      this.getFiles();
    });
  }

  getUrl(id): any {
    return this.profilePictureUrl + id;
  }

  selectMainimage(id): any {
    const data = {draftid: this.formGroup.value.draftid, fileid: id};
    this.service.postMainimage(this.entityId, data).subscribe(resp => {
      this.mainImageId = id;
      this.list = [2];
    });
  }

  onSuccess(): any {
    this.snackbar.open('Operation finished successfully!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
    this.router.navigateByUrl('dashboard').then();
  }

  onError(error): any {
    this.snackbar.open('Operation Failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
    this.setServerErrors(error);
  }

  setServerErrors(error): any {
    error.data?.msg.forEach(obj => {
      this.formGroup.get(obj.param).setErrors({serverError: obj.msg});
    });
  }

  hasErrorFirstTab(): boolean {
    return this.formGroup.controls['title'].hasError('serverError') ||
      this.formGroup.controls['category'].hasError('serverError') ||
      this.formGroup.controls['type'].hasError('serverError') ||
      this.formGroup.controls['abstract'].hasError('serverError');
  }

  hasErrorSecondTab(): boolean {
    return this.formGroup.controls['content'].hasError('serverError');
  }

  hasErrorThirdTab(): boolean {
    return this.formGroup.controls['bibliography'].hasError('serverError') ||
      this.formGroup.controls['authorship'].hasError('serverError') ||
      this.formGroup.controls['visibility'].hasError('serverError');
  }

  goBack(): any {
    this.location.back();
  }

}

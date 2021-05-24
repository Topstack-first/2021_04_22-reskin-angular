import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  message = '';
  path = '';

  constructor(
    private router: Router,
    private location: Location
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      message: ''
      path: ''
    };
    this.message = state.message;
    if (state.path) {
      this.path = state.path;
    }
  }

  ngOnInit(): any {
  }

  goBack(): any {
    if (this.path) {
      this.router.navigate([this.path]).then();
    } else {
      this.location.back();
    }
  }

}

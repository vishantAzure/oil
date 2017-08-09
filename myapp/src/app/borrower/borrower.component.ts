import { Component, OnInit } from '@angular/core';
import { Router}  from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { RequestService } from '../request.service';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit {
CaseData;
borrowerId;
modalData;
file;
date;
  constructor(private router: Router,public request:RequestService,public http: Http) { }

  ngOnInit() {
    this.borrowerId = JSON.parse(localStorage.getItem('User'));
    let obj={
      arg:this.borrowerId._id
    };
    this.request.post('http://localhost:8182/api/readData',obj).subscribe((res:any)=>{
      this.CaseData = JSON.parse(res._body);
      this.CaseData = JSON.parse(this.CaseData);
      console.log(this.CaseData);
      this.CaseData = this.CaseData.Cases;
      console.log(this.CaseData);
    },(err)=>{
      console.log(err);
    });
  }

  ModalData(o) {
    this.modalData = o;
  }

  Logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  fileChange(event) {
    const files = event.target.files;
    this.file = files[0];
  }

  Upload() {
      let formData:FormData = new FormData();
      formData.append("file", this.file, this.file.name);
    let obj={
        borrowerId:this.borrowerId._id,
        date:this.date,
    }
    var string = JSON.stringify(obj);
    formData.append('fields',string);
    let headers = new Headers();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Authorization', 'Bearer '+ localStorage.getItem("token"));
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://localhost:8182/api/addComplianceCertificate', formData, options)
        .map(res => res.json())
        .subscribe(
            data => console.log('success'),
            error => console.log(error)
        );
  }

}
import { Component, OnInit, Inject,Input,ViewChild} from '@angular/core';
import {Dish} from '../shared/dish';
import {Params, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { Comment} from '../shared/comment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {trigger,state,style,animate,transition}  from '@angular/animations';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations:[
    trigger('visiblity',[
      state('shown',style({
        transform: 'scale(1.0)',
        opacity: 1
    })),

    state('hidden', style({
      transform: 'scale(0.5)',
      opacity: 0
  })),
  transition('* => *', animate('0.5s ease-in-out'))
])
]




})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds:string[];
  prev:string;
  next:string;
  ratingForm:FormGroup;
  comment:Comment;
  errMess:string;
  dishcopy:Dish;
  visiblity='shown';

//Reset the field into begining value
@ViewChild('fform') feedbackFormDirective;

formErrors = {
  'author':'',
  'comment':'',
 };

 validationMessages={
  'author': {
    'required':      'Name is required.',
    'minlength':     'Name must be at least 2 characters long.',
    'maxlength':     'Name cannot be more than 25 characters long.'
  },
  'comment': {
    'required':      'comment is required.',
    'minlength':     'comment must be at least 2 characters long.',
    'maxlength':     'comment cannot be more than 55 characters long.'
  },

}
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,

    private location: Location,
    private fb: FormBuilder,
     @Inject('BaseURL') private BaseURL)
     {
      
     }

  ngOnInit() {
    this.createForm();
    this.dishservice.getDishIds()
    .subscribe(dishIds=>this.dishIds=dishIds);
    this.route.params
    .pipe(switchMap((params:Params)=> {this.visiblity = 'hidden'; 
    return this.dishservice.getDish(params['id']);}))
    .subscribe(dish=>{this.dish=dish;this.dishcopy=dish;
    this.setPrevNext(dish.id);this.visiblity='shown'; 
     
  }, errmess => this.errMess = <any>errmess);
  
}
    
 setPrevNext(dishId:string){
   const index=this.dishIds.indexOf(dishId);
   this.prev=this.dishIds[(this.dishIds.length+index-1)%this.dishIds.length];
   this.next=this.dishIds[(this.dishIds.length+index+1)%this.dishIds.length];
 }

  goBack(): void {
    this.location.back();
  }



 createForm(){
   this.ratingForm=this.fb.group({
   
    comment: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(20)]],
    author: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(20)]],
   
    rating:5
   });
   this.ratingForm.valueChanges
   .subscribe(data => this.onValueChanged(data));
   this.onValueChanged(); //reset the validation message
   }


   onValueChanged(data?: any) {
   if (!this.ratingForm) { return; }
    const form = this.ratingForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
      const messages = this.validationMessages[field];
      for (const key in control.errors) {
      if (control.errors.hasOwnProperty(key)) {
      this.formErrors[field] += messages[key] + ' ';
      }
    }
  }
 }
}
this.comment=form.value;
}

onSubmit() {
  this.comment = this.ratingForm.value;
  this.comment.date = new Date().toISOString();
  //this.dish.comments.push(this.comment);
  console.log(this.comment);
  this.dishcopy.comments.push(this.comment);
  this.dishservice.putDish(this.dishcopy)
  .subscribe(dish =>{
    this.dish=dish;
    this.dishcopy=dish;
  }, errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
  
  //this.commentFormDirective.resetForm();
  this.comment = null;
  this.ratingForm.reset({
    author: '',
    comment: '',
    rating: 5
  });
}

  }


export class SliderFormattingExample {
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 5) {
      return Math.round(value / 5);
    }

    return value;
  }
}

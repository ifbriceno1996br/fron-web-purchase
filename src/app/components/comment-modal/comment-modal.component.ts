import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss']
})
export class CommentModalComponent implements OnChanges {
  commentForm: FormGroup;
  showCommentField: boolean = false;

  @Input() title: string = '';
  @Input() requestAmount: number = 0;
  @Input() isRejection: boolean = false;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string | null>();

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: ['', []]
    });
  }

  ngOnChanges() {
    this.showCommentField = this.isRejection || this.requestAmount > 500;
    const commentControl = this.commentForm.get('comment');
    
    if (this.showCommentField) {
      commentControl?.setValidators([Validators.required]);
    } else {
      commentControl?.clearValidators();
    }
    
    commentControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.commentForm.valid) {
      this.submit.emit(this.showCommentField ? this.commentForm.value.comment : null);
      this.close.emit();
      this.commentForm.reset();
    }
  }

  onCancel() {
    this.close.emit();
    this.commentForm.reset();
  }
}

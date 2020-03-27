import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-content-manager-info-pop-up',
  templateUrl: './content-manager-info-pop-up.component.html',
  styleUrls: ['./content-manager-info-pop-up.component.scss']
})
export class ContentManagerInfoPopUpComponent implements OnInit {

  @Input() failedList;
  @Input() isChangeLocation: boolean;
  @Input() suggestedDrive: string;
  @ViewChild('modal') modal;
  @Output() dismissed = new EventEmitter<any>();
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }
  closeModal() {
    this.modal.deny();
    this.dismissed.emit();
  }
}
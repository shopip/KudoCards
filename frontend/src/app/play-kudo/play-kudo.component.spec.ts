import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayKudoComponent } from './play-kudo.component';

describe('PlayKudoComponent', () => {
  let component: PlayKudoComponent;
  let fixture: ComponentFixture<PlayKudoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayKudoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayKudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

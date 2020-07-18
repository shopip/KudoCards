
import { KudoListComponent } from './KudoListComponents';
import { NgModule } from '@angular/core';
import { PostModule } from './Posts/PostModule';
import { CommonImportsModule } from '../commonimports/common-imports/common-imports.module';



@NgModule({
    imports: [
        PostModule,
        CommonImportsModule
    ],
    exports: [
        PostModule,
        KudoListComponent,
        CommonImportsModule
    ],
    declarations: [KudoListComponent],
    providers: [ ],
})
export class KudoModule { }

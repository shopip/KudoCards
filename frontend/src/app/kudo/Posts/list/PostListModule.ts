import { PostListComponent } from './PostListComponents';

import { NgModule } from '@angular/core';
import { CommonImportsModule } from 'src/app/commonimports/common-imports/common-imports.module';

@NgModule({
    imports: [
     CommonImportsModule
    ],
    exports: [
        PostListComponent
    ],
    declarations: [
        PostListComponent
    ],
    providers: [],
})
export class PostListModule { }

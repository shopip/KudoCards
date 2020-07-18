import { apiconfig } from '../../config/apiconfig';
import { NotificationPostDTO } from './../../DTO/NotificationPostDTO';
import { Injectable, HttpService } from '@nestjs/common';

import { map } from 'rxjs/operators';

@Injectable()
export class AgiliboNotificationService {

        constructor(private http: HttpService){

        }

        sendNotification (data : NotificationPostDTO) {

        
             const reqToken = data.token ;
             delete data.token ;

            return this.http.post(`${apiconfig.coreUrl}${apiconfig.notification}`,data,{headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${reqToken}`
          
                 }})
            .pipe(
                map(response => response.data.data)
            ).toPromise().then(()=>console.log('Notification Sent'))
            .catch(error => {

                console.log('Couldnt Send Notification');
                console.log(error)
               return null;
            }); 
            
           
        }


}

import { MailDTO } from '../../DTO/MailDTO';
import { CreateKudoDto } from '../../DTO/CreateKudoDto';
import { Injectable, HttpService } from '@nestjs/common';
import * as fs from 'fs';
import { renderTemplateFile} from 'template-file'

import * as FormData from 'form-data';
import { apiconfig } from '../../config/apiconfig';





@Injectable()
export class MailService {

    constructor(private http  : HttpService){

    }

    public async  getMailContent (createKudoDTO : CreateKudoDto) : Promise<string> {

        const tempData = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            From_id : createKudoDTO.fromName,
             // eslint-disable-next-line @typescript-eslint/camelcase
            kudo_title : JSON.parse(JSON.stringify(createKudoDTO.kudoType)).title,
            // eslint-disable-next-line @typescript-eslint/camelcase
            To_id : createKudoDTO.toName,
            // eslint-disable-next-line @typescript-eslint/camelcase
            kudo_message : createKudoDTO.content,
            // eslint-disable-next-line @typescript-eslint/camelcase
            kudo_image : JSON.parse(JSON.stringify(createKudoDTO.kudoType)).icon,
             // eslint-disable-next-line @typescript-eslint/camelcase
            kudo_color : JSON.parse(JSON.stringify(createKudoDTO.kudoType)).color,

            url : apiconfig.kudoUrl,

          }

         return renderTemplateFile('./src/assets/congratulations.html', tempData)
                .then(renderedString =>   renderedString )
    

     
       

        
    }

    public sendMail (mail : MailDTO) {

        console.log('sending mail');
       

        const formData =  new FormData();
        formData.append('is_production', '0');
        formData.append('from_email', 'admin@agilibo.de');
        formData.append('from_name', mail.from_name);
        formData.append('to_name', mail.to_name);
        formData.append('to_email', mail.to_email);
        formData.append('subject', 'You have received a new Kudo Card in Agilibo');
        formData.append('content', mail.content);

        

        this.http.request({
            method: 'post',
            url: `${apiconfig.coreUrl}${apiconfig.mail}`,
            data:formData,
           
            headers: {
                
                'Content-Type': 'multipart/form-data; boundary='+ formData.getBoundary(),
                'authorization': 'Bearer '+ mail.token,
          
                 }
            }).toPromise()
            .then((response)=> { 
                console.log('success response');
                console.log(response.data) 
            })
            .catch((err)=>{console.log(JSON.parse(JSON.stringify(err)))});
       
    }

     public evalTemplate(s, params) {
        return Function(...Object.keys(params), "return " + s)
          (...Object.values(params));
      }
      

    

}

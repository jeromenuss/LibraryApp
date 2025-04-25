import {BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {ProfilesService} from "../profiles/profiles.service";
import {createHash} from "crypto";
import * as firebase from 'firebase-admin';
import {auth} from "firebase-admin";
import {RegisterDto} from "../../core/DTO/register.dto";
import {UpdateUserDto} from "../../core/DTO/update-user.dto";
import UpdateRequest = auth.UpdateRequest;
import UserRecord = auth.UserRecord;
import {Profile} from "../../core/models/profile.model";

@Injectable()
export class AuthService {

    constructor(private profilesService:ProfilesService) {
    }

    async createUser(registerDto:RegisterDto){
        const email = registerDto.email;
        const password = registerDto.password;

        const userRecord = await firebase.auth().createUser({email: email, password:password});

        //Création du profil d'utilisateur
        await this.profilesService.createProfile(registerDto, userRecord.uid);

        return userRecord;
    }

    /**
     * Mise à jour de l'utilisateur dans FireAuth et également dans la collection
     * Profile
     *
     * @Param id Identifiant du profil d'utilisateur
     * @param updateUser Donnée de l'utilisateur à mettre à jour
     * */
    async updateUser(id:string, updateUser:UpdateUserDto){
        //On récupère l'identifiant de l'utilisateur fireAuth
        let uid = await this.profilesService.getUserId(id);

        //Création de la requête
        const updateRequest:UpdateRequest = {};
        updateRequest.email = updateUser.email;
        if(updateUser.password){
            updateRequest.password = updateUser.password;
        }


        //On tente la mise à jour de l'utilisateur
        let userRecord:UserRecord;
        try{
            userRecord = await firebase.auth().updateUser(uid, updateRequest);
        }
        catch(error){
            console.log(error);
            throw new InternalServerErrorException(error.message);
        }

        console.log('userRecord', userRecord);

        if(userRecord){
            const profile:Partial<Profile> = {
                id: updateUser.id,
                name : updateUser.name,
                lastName : updateUser.lastname,
                phone : updateUser.phone,
                mail : updateUser.email
            }
            await this.profilesService.updateDocAsync(updateUser.id, profile);
        }
    }

    async getUser(uid:string){
        return await firebase.auth().getUser(uid);
    }

/*    async updateUser(uid:string,updateData:any){
        return await firebase.auth().updateUser(uid, updateData);
    }*/

    async deleteUser(uid:string){
        await this.profilesService.deleteProfileByUuid(uid);
        return await firebase.auth().deleteUser(uid);
    }

    async signIn(email:string, pass:string):Promise<{access_token:string}>{
/*
        return await this.userService.findOneByEmail(email).then((user) => {
           if(user.password !== this.hash(pass)){
               throw new UnauthorizedException();
           }

           const payload = {userId:user.id, email:user.mail, name:`${user.name} ${user.lastname}`};
           return {
               access_token : this.jwtService.sign(payload),
           }
        });
*/
        return new Promise<{access_token:string}>((resolve,reject)=>{
            resolve({access_token:""});
        })
    }

    private hash(password:string){
        return createHash('sha256').update(password).digest('hex');
    }
}

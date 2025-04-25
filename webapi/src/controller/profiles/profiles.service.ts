import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {FirebaseRepository} from "../../firebase/firebase.repository";
import * as admin from 'firebase-admin';
import {Profile} from "src/core/models/profile.model";
import {RegisterDto} from 'src/core/DTO/register.dto';

@Injectable()
export class ProfilesService extends FirebaseRepository<Profile> {
    constructor() {
        super();
    }

    async createProfile(registerDto:RegisterDto, uuid:string): Promise<Profile> {
        const profile:Profile = {
            uuid: uuid,
            mail: registerDto.email,
            name: registerDto.name,
            lastName: registerDto.lastName,
            registered: admin.firestore.Timestamp.now(),
            isActive: true
        }

        return await this.createDocAsync(profile);
    }

    async findByUid(uuid:string):Promise<Profile> {
        const querySnapshot = await this.collection.where('uuid', '==', uuid).get();

        if(querySnapshot.empty){
            throw new NotFoundException('Le profil utilisateur est introuvable');
        }

        const userDoc = querySnapshot.docs[0];

        return {
            id: userDoc.id,
            ...userDoc.data() as Profile,
        };
    }

    async getUserId(id:string):Promise<string> {
        const userDoc = await this.collection.doc(id).get();

        if(userDoc)
            return userDoc.data()!.uuid;
        else
            throw new NotFoundException('Le profil utilisateur est introuvable');
    }

    async deleteProfileByUuid(uuid:string){
        //On récupère les utilisateurs avec l'uuid passé en paramètre
        const profileDoc = await this.collection.where('uuid', '==', uuid).select("id").get();

        profileDoc.docs.map((profile => {
            this.deleteDocAsync(profile.id);
        }))
    }

    async disableProfile(id:string){
        const profileDoc = await this.collection.doc(id).get();
        if(!profileDoc.exists){
            throw new NotFoundException("L'utilisateur recherché n'existe pas");
        }

        const profile = profileDoc.data() as Profile;

        //On vérifie si l'utilisateur est déjà désactivé. Si c'est le cas, on remonte une erreur.
        if(!profile.isActive)
            throw new ConflictException("L'utilisateur est déjà désactivé");

        profile.isActive = false;

        //On met à jour l'utilisateur
        await this.updateDocAsync(id, profile);
    }
}

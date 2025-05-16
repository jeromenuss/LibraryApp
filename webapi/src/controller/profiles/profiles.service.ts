import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import * as admin from 'firebase-admin';
import { Profile } from 'src/core/models/profile.model';
import { RegisterDto } from 'src/core/DTO/register.dto';
import {ProfileDetailDto} from "../../core/DTO/profile-detail.dto";
import {ApiHttpException} from "../../core/commons/api-http.exception";

@Injectable()
export class ProfilesService extends FirebaseRepository<Profile> {
  constructor() {
    super();
  }

  async createProfile(
    registerDto: RegisterDto,
    uuid: string,
  ): Promise<Profile> {
    const profile: Profile = {
      uuid: uuid,
      mail: registerDto.email,
      name: registerDto.name,
      lastName: registerDto.lastName,
      registered: admin.firestore.Timestamp.now(),
      isActive: true,
    };

    return await this.createDocAsync(profile);
  }

  async findByUid(uuid: string): Promise<Profile> {
    const querySnapshot = await this.collection.where('uuid', '==', uuid).get();

    if (querySnapshot.empty) {
      throw new NotFoundException('Le profil utilisateur est introuvable');
    }

    const userDoc = querySnapshot.docs[0];

    return {
      id: userDoc.id,
      ...(userDoc.data() as Profile),
    };
  }

  async getUserId(id: string): Promise<string> {
    const userDoc = await this.collection.doc(id).get();

    if (userDoc) return userDoc.data()!.uuid as string;
    else throw new NotFoundException('Le profil utilisateur est introuvable');
  }

  async getUserByEmail(email: string): Promise<ProfileDetailDto> {
    const querySnapshot = await this.collection.where('mail', '==', email).get();

    if (querySnapshot.empty) {
      throw new NotFoundException("L'utilisateur recherché est introuvable");
    }

    const profileDoc = querySnapshot.docs[0];
    const profileData = profileDoc.data() as Profile;

    /*A terme :
      canBorrow =
        - Si l'utilisateur est active
        - Si l'utilisateur emprunte actuellement mois que 5 livres.
        - Si l'utilisateur a un emprunt actuellement en retard.
    */
    let canBorrow = true;
    let reason: string = "";

    if(!profileData.isActive){
      canBorrow = false;
      reason = "Le profile d'utilisateur est désactivé"
    }

    return {
      id: profileDoc.id,
      email : profileData.mail,
      name: profileData.name ?? "",
      lastName: profileData.lastName ?? "",
      canBorrow : canBorrow,
      reason: reason
    }
  }

  async checkUserCanBorrow(id: string): Promise<boolean> {

    const profileDoc = await this.collection.doc(id).get();
    if (!profileDoc.exists) {
      throw new ApiHttpException("profile.not_found");
    }

    let profile = profileDoc.data() as Profile;

    if(!profile.isActive) {
      throw new ApiHttpException("profile.disabled");
    }

    return true;
  }

  async deleteProfileByUuid(uuid: string) {
    //On récupère les utilisateurs avec l'uuid passé en paramètre
    const profileDoc = await this.collection
      .where('uuid', '==', uuid)
      .select('id')
      .get();

    profileDoc.docs.map(async (profile) => {
      await this.deleteDocAsync(profile.id);
    });
  }

  async disableProfile(id: string) {
    const profileDoc = await this.collection.doc(id).get();
    if (!profileDoc.exists) {
      throw new NotFoundException("L'utilisateur recherché n'existe pas");
    }

    const profile = profileDoc.data() as Profile;

    //On vérifie si l'utilisateur est déjà désactivé. Si c'est le cas, on remonte une erreur.
    if (!profile.isActive)
      throw new ConflictException("L'utilisateur est déjà désactivé");

    profile.isActive = false;

    //On met à jour l'utilisateur
    await this.updateDocAsync(id, profile);
  }
}

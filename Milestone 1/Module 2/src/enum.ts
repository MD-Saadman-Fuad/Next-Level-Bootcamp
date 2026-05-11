

// type UserRoles = 'admin' | 'editor' | 'viewer';

enum UserRoles {
    Admin = 'admin',
    Editor = 'editor',
    Viewer = 'viewer'
}

const canEdit = (role: UserRoles) =>{
    if(role === UserRoles.Admin || role === UserRoles.Editor){
        return true;
    }
    return false;

}

const isEditPermitted = canEdit(UserRoles.Admin); // true
const isEditPermitted2 = canEdit(UserRoles.Viewer); // false

console.log(isEditPermitted);
console.log(isEditPermitted2);
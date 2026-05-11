

// type UserRoles = 'admin' | 'editor' | 'viewer';

// enum UserRoles {
//     Admin = 'admin',
//     Editor = 'editor',
//     Viewer = 'viewer'
// }

const UserRoles1 = {
    Admin: 'admin',
    Editor: 'editor',
    Viewer: 'viewer'
} as const;

const canEdit1 = (role: (typeof UserRoles1)[keyof typeof UserRoles1]) =>{
    if(role === UserRoles1.Admin || role === UserRoles1.Editor){
        return true;
    }
    return false;

}

const isEditPermitted = canEdit1(UserRoles1.Admin); // true
const isEditPermitted2 = canEdit1(UserRoles1.Viewer); // false

console.log(isEditPermitted);
console.log(isEditPermitted2);
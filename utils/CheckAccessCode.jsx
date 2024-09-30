
export const CheckAccessCode =  (access_code, userId, permissions) => { 
    if (userId !== null && userId !== undefined) {
        if (userId === 1 || userId === 2) {
            return true;
        } else {
            return permissions?.includes(access_code);
        }
    }
    return false;
}; 
const ACLENTRY_TYPE = {
    OWN: 'OWN',
    WRITE: 'WRITE',
    READ: 'READ',
    NONE: 'NONE'
}

const ACLENTRY_TARGET_TYPE = {
    USER: 'USER',
}

export default class ACLEntry {
    constructor(params = {targetType: ACLENTRY_TARGET_TYPE.USER}) {
        if(!params.type || !params.targetId || !params.targetType) throw new Error("ACL init error")
        this.type = params.type
        this.targetId = params.targetId
        this.targetType = params.targetType
        this.targetLabel = params.targetLabel
    }

    toObject() {
        return {
            type: this.type,
            targetId: this.targetId,
            targetType: this.targetType,
            targetLabel: this.targetLabel
        }
    }
}

export { ACLEntry, ACLENTRY_TYPE, ACLENTRY_TARGET_TYPE }
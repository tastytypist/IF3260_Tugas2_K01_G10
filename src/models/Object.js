class Object {
    constructor(name, position, count, color, translation = [0,0,0], rotation = [0,0,0], scale = [1,1,1], fov = 0, cameraAngle = 0, cameraRadius = 100) {
        this.name = name;
        this.position = position;
        this.count = count;
        this.color = color;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
        this.fov = fov;
        this.cameraAngle = cameraAngle
        this.cameraRadius = cameraRadius
    }

    save() {

    }
}

export default Object;

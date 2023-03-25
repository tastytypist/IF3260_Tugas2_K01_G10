class Object {
    constructor(name, position, count, color, translation = [0,0,0], rotation = [0,0,0], scale = [1,1,1]) {
        this.name = name;
        this.position = position;
        this.count = count;
        this.color = color;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }

    save() {

    }
}

export default Object;
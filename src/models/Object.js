class Object {
    constructor(name, vertices, colors, indices, translation = [0,0,0]) {
        this.name = name;
        this.vertices = vertices;
        this.colors = colors;
        this.indices = indices;
        this.translation = translation;
    }

    setVertices(vertices) {
        this.vertices = vertices;
    }

    setColors(colors) {
        this.colors = colors;
    }

    setIndices(indices) {
        this.indices = indices;
    }

    save() {

    }
}

export default Object;
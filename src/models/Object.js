class Object {
    constructor(name, vertices, colors, indices) {
        this.name = name;
        this.vertices = vertices;
        this.colors = colors;
        this.indices = indices;
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

    getVertices() {
        return this.vertices;
    }

    getColors() {
        return this.colors;
    }

    getIndices() {
        return this.indices;
    }

    getAll() {
        return this.vertices, this.indices, this.colors;
    }
}

export default Object;
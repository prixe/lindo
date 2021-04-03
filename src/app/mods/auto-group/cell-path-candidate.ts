export class CellPathCandidate {

    public i;
    public j;
    public w;
    public d;
    public path;

    constructor(i, j, w, d, path) {
        this.i = i; // position i in the grid
        this.j = j; // position j in the grid
        this.w = w; // weight of the path
        this.d = d; // remaining distance to destination

        // positions previously taken in the path
        this.path = path;
    }

}
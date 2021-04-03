export class CellPathData {

    public i;
    public j;
    public floor;
    public zone;
    public speed;
    public weight;
    public candidateRef;

    constructor(i, j) {
        this.i = i;
        this.j = j;

        this.floor = -1;
        this.zone = -1;
        this.speed = 1;

        this.weight = 0;
        this.candidateRef = null;
    }
}
export class Player {
  id: string;
  socketId: string;
  name: string;
  ready: boolean = false;

  constructor(id: string, socketId: string, name: string) {
    this.id = id;
    this.socketId = socketId;
    this.name = name;
  }
}

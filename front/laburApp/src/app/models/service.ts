import { IService } from "../interfaces/service.interface";

export class Service {
  public id: string;
  public description?: string;
  public mainCategory?: string;
  public secondaryCategory?: string;
  public state: string;
  public department: string;
  public locality: string;
  public profesionalId: string;

  constructor(props: IService) {
    this.id = props.id;
    this.description = props.description;
    this.mainCategory = props.mainCategory;
    this.secondaryCategory = props.secondaryCategory;
    this.state = props.state;
    this.department = props.department;
    this.locality = props.locality;
    this.profesionalId = props.profesionalId;
  }
}

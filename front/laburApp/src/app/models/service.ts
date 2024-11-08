import { IService } from "../interfaces/service.interface";

export class Service {
  public description?: string;
  public mainCategory?: string;
  public secondaryCategory?: string;
  public state: string;
  public department: string;
  public locality: string;
  public profesionalId: number;

  constructor(props: IService) {
    this.description = props.description;
    this.mainCategory = props.mainCategory;
    this.secondaryCategory = props.secondaryCategory;
    this.state = props.state;
    this.department = props.department;
    this.locality = props.locality;
    this.profesionalId = props.profesionalId;
  }
}

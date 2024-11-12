import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private serviceId: number = 0;

  setServiceId(id: number): void {
    this.serviceId = id;
  }

  getServiceId(): number {
    return this.serviceId;
  }
}

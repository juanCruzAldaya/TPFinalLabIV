// booking.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  constructor(private http: HttpClient) {}

  addBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(
      `${environment.LOCAL_API_URL}/contrataciones`,
      bookingData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

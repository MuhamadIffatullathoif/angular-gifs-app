import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Gif, SearchResponse} from "../interfaces/gifs.interface";

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'Y2hHJq11UwHpUMPTo31kPLPfFo14BfwX';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private httpClient: HttpClient) {
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0, 10);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set("api_key", this.apiKey)
      .set("limit", "10")
      .set("q", tag);

    this.httpClient.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe(response => {
        this.gifsList = response.data;
        console.log(this.gifsList);
      })
  }
}

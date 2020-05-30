import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private static readonly BASE_URL = 'https://udang-http-requests.firebaseio.com';
  private static readonly POSTS_URL = AppComponent.BASE_URL + '/posts.json';
  loadedPosts = [];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.http
      .post(
        AppComponent.POSTS_URL,
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  private fetchPosts() {
    const subscription = this.http.get(AppComponent.POSTS_URL)
      .pipe(map(responseData => {
        const postsArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }

        return postsArray;
      }))
      .subscribe(posts => {
        console.log(posts);
      });
  }

  onClearPosts() {
    // Send Http request
  }
}

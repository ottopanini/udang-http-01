import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Post} from './post.model';
import {catchError, map, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private static readonly BASE_URL = 'https://udang-http-requests.firebaseio.com';
  public static readonly POSTS_URL = PostsService.BASE_URL + '/posts.json';

  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    this.http
      .post<{name: string}>(
        PostsService.POSTS_URL,
        postData,
        {
          observe: 'response' // now get full response including header info
        }
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => this.error = error);
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    return this.http.get<{ [key: string]: Post }>(PostsService.POSTS_URL, {
      headers: new HttpHeaders({
        'Custom-Header': 'hello'
      }),
      params: searchParams
    })
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }

        return postsArray;
      }
    ), catchError(err => {
      // send to analytics server
        return throwError(err);
      }));
  }

  clearPosts() {
    return this.http.delete(PostsService.POSTS_URL, {
      observe: 'events',
      responseType: 'text' // json
    }).pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Sent) {
        console.log('sent...');
      }
      if (event.type === HttpEventType.Response) {
        console.log(event.body);
      }
    }));
  }
}

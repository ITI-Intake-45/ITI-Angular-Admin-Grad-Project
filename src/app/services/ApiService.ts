export class ApiService {
  static readonly authApiUrl = 'http://localhost:8080';
  static readonly apiUrl = 'http://localhost:8080/api/v1';

  private static readonly imagePathPrefix = 'http://localhost:8080/images';

  static getRealImagePath(path: string): string {
    return this.imagePathPrefix + '/' + path;
  }

}

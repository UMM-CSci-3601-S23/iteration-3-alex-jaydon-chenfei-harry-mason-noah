import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request } from './request';
import { map } from 'rxjs/operators';
import { Pledge } from '../donor-pledge/pledge';
import { Router } from '@angular/router';
import { RequestedItem } from './requestedItem';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  // The URL for the requests part of the server API
  readonly requestClientUrl: string = `${environment.apiUrl}clientRequests`;
  readonly newRequestClientUrl: string = `${environment.apiUrl}clientRequests`;
  readonly requestDonorUrl: string = `${environment.apiUrl}donorRequests`;
  readonly newRequestDonorUrl: string = `${environment.apiUrl}donorRequests`;
  readonly newPledgeDonorUrl: string = `${environment.apiUrl}donorPledges`;
  readonly updateRequestUrl: string = `${environment.apiUrl}editRequest`;
  readonly addNewRequestedItem: string = `${environment.apiUrl}addNewRequestedItem`;
  readonly requestedItem: string = `${environment.apiUrl}getRequestedItems`;
  readonly getRequestedItem: string = `${environment.apiUrl}requestedItem`;
  readonly itemDonorUrl: string = `${environment.apiUrl}requestedItem`;
  readonly authUrl: string = `http://localhost:4568/api/auth`;
  readonly itemMap = new Map<string, string>([
    ['glutenFree','Gluten Free'],
    ['lowSugar','Low Sugar'],
    ['lactoseFree','Lactose Free'],
    ['vegetarian','Vegetarian'],
    ['miscFreshFruit','Misc. fresh fruit'],
    ['appleJuice','Apple juice'],
    ['frozenPeaches','Frozen peaches'],
    ['mixedFruit','Mixed fruit'],
    ['peaches','Peaches'],
    ['appleSauce','Apple sauce'],
    ['dates','Dates'],
    ['carrots','Carrots'],
    ['potatoes','Potatoes'],
    ['miscVeggies','Misc. veggies'],
    ['corn','Corn'],
    ['greenBeans','Green beans'],
    ['peas','Peas'],
    ['sweetPotatoes','Sweet potatoes'],
    ['spinach','Spinach'],
    ['cannedCarrots','Canned carrots'],
    ['dicedTomatoes','Diced tomatoes'],
    ['spaghettiSauce','Spaghetti sauce'],
    ['groundBeef','Ground beef'],
    ['groundBeefPorkBlend','Ground beef/pork blend'],
    ['plantBasedBurgers','Plant based burgers'],
    ['pizzaRanchPizza','Pizza ranch pizza'],
    ['veggieRavioli','Veggie ravioli'],
    ['chickenDrumsticks','Chicken drumsticks'],
    ['wholeChicken','Whole chicken'],
    ['chickenBreast','Chicken breast'],
    ['chickenLegQtrs','Chicken leg quarters'],
    ['fishSticks','Fish sticks'],
    ['ham','Ham'],
    ['assortedMeats','Assorted meats'],
    ['chicken','Chicken'],
    ['tuna','Tuna'],
    ['salmon','Salmon'],
    ['pastaWithMeatSauce','Pasta with meat sauce'],
    ['pastaInButterSauce','Pasta in butter sauce'],
    ['cannedChili','Canned chili'],
    ['vegCurry','Veg curry'],
    ['hotDogSauce','Hot dog sauce'],
    ['blackEyedPeas','Black-eyed peas'],
    ['yellowEyedBeans','Yellow-eyed beans'],
    ['pintoBeans','Pinto beans'],
    ['porkAndBeans','Pork and beans'],
    ['blackBeans','Black beans'],
    ['driedPintoBeans','Dried pinto beans'],
    ['yellowSplitPeas','Yellow split peas'],
    ['kidneyBeans','Kidney beans'],
    ['miscDriedBeans','Misc. dried beans'],
    ['peanutButter','Peanut butter'],
    ['almonds','Almonds'],
    ['walnuts','Walnuts'],
    ['crackers','Crackers'],
    ['cookies','Cookies'],
    ['miscSnacks','Misc. snacks'],
    ['refriedBeans','Refried beans'],
    ['whiteBeans','White beans'],
    ['rice','Rice'],
    ['stuffingMix','Stuffing mix'],
    ['pancakeMix','Pancake mix'],
    ['quickOats','Quick oats'],
    ['readyToEatCereal','Ready-to-eat cereal'],
    ['elbowNoodles','Elbow noodles'],
    ['macAndCheese','Mac and cheese'],
    ['pennePasta','Penne pasta'],
    ['instantPastaOrRice','Instant pasta or rice'],
    ['bread','Bread'],
    ['hamburgerBuns','Hamburger buns'],
    ['hotDogBuns','Hotdog buns'],
    ['bakedGoods','Baked goods'],
    ['freshMilkLactoseFree','Fresh milk (lactose free)'],
    ['miscDairyProducts','Misc. dairy products'],
    ['cheese','Cheese'],
    ['yogurt','Yogurt'],
    ['butter','Butter'],
    ['shelfStableMilk','Shelf stable milk'],
    ['bakingMix','Baking mix'],
    ['cakeMix','Cake mix'],
    ['flour','Flour'],
    ['muffinMix','Muffin mix '],
    ['cookieMix','Cookie mix'],
    ['miscBakingItems','Misc. baking items'],
    ['vegOil','Vegetable oil'],
    ['chickenNoodle','Chicken noodle soup'],
    ['tomatoSoup','Tomato soup'],
    ['vegetableSoup','Vegetable soup'],
    ['creamyCannedSoup','Creamy canned soup'],
    ['miscSoups','Misc. soups'],
    ['seasonings','Seasonings'],
    ['hotSauce','Hot sauce'],
    ['saladDressing','Salad dressing'],
    ['ranchDressing','Ranch dressing'],
    ['mustard','Mustard'],
    ['syrup','Syrup'],
    ['miscPickled','Misc. pickled'],
    ['fruitOrVegetablePuree','Fruit or vegetable purée'],
    ['babyCereal','Baby cereal'],
    ['formula','Formula'],
    ['newbornGiftBag','Newborn gift bag'],
    ['diapers','Diapers'],
    ['shampoo','Shampoo'],
    ['bodyOrHandSoap','Body or hand soap'],
    ['toothpaste','Toothpaste'],
    ['toothbrushes','Toothbrushes'],
    ['birthdayPartyKit','Birthday party kit'],
    ['handSanitizer','Hand sanitizers'],
    ['feminineHygiene','Feminine hygiene'],
    ['dishSoap','Dish soap'],
    ['laundryDetergent','Laundry detergent'],
    ['disinfectingWipes', 'Disinfecting wipes']
  ]);
  readonly priorityUrl: string = `${environment.apiUrl}clientRequests/set-priority`;

  private readonly descriptionKey = 'description';
  private readonly priorityKey = 'priority';


  constructor(private httpClient: HttpClient) {
  }

  getClientRequests(filters?: {description?: string}): Observable<Request[]> {
  public getPriorityKey(): string{
    return this.priorityKey;
  }

  getClientRequests(filters?: {itemType?: ItemType; foodType?: FoodType; description?: string}): Observable<Request[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {

      if (filters.description) {
        httpParams = httpParams.set(this.descriptionKey, filters.description);
      }
// We'll need to add a conditional in here that handles a donor get request as well
    return this.httpClient.get<Request[]>(this.requestClientUrl, {
      params: httpParams,
    });

  }


  getRequestById(id: string): Observable<Request>{
    return this.httpClient.get<Request>(this.requestClientUrl + '/' + id);
  }

  getDonorRequestById(id: string): Observable<Request> {
    return this.httpClient.get<Request>(this.requestDonorUrl + '/' + id);
  }


  getRequestedItemById(id: string): Observable<RequestedItem> {
    return this.httpClient.get<RequestedItem>(this.getRequestedItem + '/' + id);
  }

  getDonorRequests(filters?: {name?: string}): Observable<RequestedItem[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.name) {
        httpParams = httpParams.set(this.descriptionKey, filters.name);
      }
    }
// We'll need to add a conditional in here that handles a donor get request as well
    return this.httpClient.get<RequestedItem[]>(this.requestedItem, {
      params: httpParams,
    });
  }

  descriptionKey(descriptionKey: any, description: string): HttpParams {
    throw new Error('Method not implemented.');
  }

  filterRequests(requests: Request[]): Request[] {
    const filteredRequests = requests;
    return filteredRequests;
  }
// This is the method that submit form calls on the new request component.
// My idea is to add another function that handles newRequestDonor stuff
  addClientRequest(newRequest: Partial<Request>): Observable<string> {
    // Send post request to add a new Request with the Request data as the body.
    return this.httpClient.post<{id: string}>(this.newRequestClientUrl, newRequest).pipe(map(res => res.id));
  }

  addDonorRequest(newRequest: Partial<Request>): Observable<string> {
    // Set a default value for newPriority if not provided
    // Send post request to add a new Request with the Request data as the body.
    return this.httpClient.post<{id: string}>(this.newRequestDonorUrl, {...newRequest}).pipe(map(res => res.id));
  }

  addDonorItem(newItem: Partial<RequestedItem>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.addNewRequestedItem, newItem).pipe(map(res => res.id));
  }

  addDonorPledge(newPledge: Partial<Pledge>): Observable<string> {
    // Send post request to add a new Pledge with the Pledge data as the body.
    return this.httpClient.post<{id: string}>(this.newPledgeDonorUrl, newPledge).pipe(map(res => res.id));
  }

  deleteClientRequest(request: Partial<Request>): Observable<object> {
    // Send delete request to delete a request
    return this.httpClient.delete(this.requestClientUrl + '/' + request._id).pipe(map(res => res));
  }

  deleteDonorRequest(request: Partial<Request>): Observable<object> {
    // Send delete request to delete a request
    return this.httpClient.delete(this.requestDonorUrl + '/' + request._id).pipe(map(res => res));
  }

  deleteDonorItem(item: Partial<RequestedItem>): Observable<object> {
    // Send delete request to delete an item
    return this.httpClient.delete(this.itemDonorUrl + '/' + item._id).pipe(map(res => res));
  }

  updateRequest(request: Partial<Request>): Observable<object> {
    return this.httpClient.post(this.updateRequestUrl, request).pipe(map(res=> res));
  }

  addRequestPriority(request: Request, priorityGiven: number): Observable<number>{
    const putUrl = `${this.priorityUrl}/${request._id}`;
    const priorityBody = new HttpParams().set(this.priorityKey, priorityGiven);
      return this.httpClient.put<{priority: number}>(putUrl, priorityGiven,{
        params:priorityBody,
      }).pipe(map(res => res.priority));
  }

  public getReadableItem(camelCase: string, diaperSize?: string): string{
    const mappedValue = this.itemMap.get(camelCase);
    if (camelCase === 'diapers' && diaperSize){
      return mappedValue +' (size: ' + diaperSize + ')';
    }
    else if (mappedValue === undefined) {
      return camelCase;
    }
    else {
      return mappedValue;
    }
  }

  public getReadableDate(date: string){
    return 'submitted a form on: ' + date.substring(4, 6) + '-' + date.substring(6,8)
      + '-'+ date.substring(0, 4);
  }

  public getReadableSelections(selections: string[], diaperSize?: string): string{
    let stringSelections = '';
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i =0; i < selections.length; i++){
      stringSelections = stringSelections + this.getReadableItem(selections[i], diaperSize) + ', ';
    }
    return stringSelections.substring(0,stringSelections.length - 2);
  }


  addRequestPriority(request: Request, priorityGiven: number): Observable<number>{
    const putUrl = `${this.priorityUrl}/${request._id}`;
    const priorityBody = new HttpParams().set(this.priorityKey, priorityGiven);

    return this.httpClient.put<{priority: number}>(putUrl, priorityGiven,{
      params:priorityBody,
    }).pipe(map(res => res.priority));
  }
}

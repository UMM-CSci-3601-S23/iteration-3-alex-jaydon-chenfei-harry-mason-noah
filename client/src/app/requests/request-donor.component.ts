import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';


@Component({
  selector: 'app-request-donor',
  templateUrl: './request-donor.component.html',
  styleUrls: ['./request-donor.component.scss'],
  providers: []
})

export class RequestDonorComponent implements OnInit, OnDestroy {
  public serverFilteredRequests: Request[];
  public filteredRequests: Request[];
  public requestDescription: string;

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
    ['groundPorkBeefBlend','Ground beef/pork blend'],
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

  authHypothesis: boolean;


  private ngUnsubscribe = new Subject<void>();

  constructor(private requestService: RequestService, private snackBar: MatSnackBar) {
  }
  //Gets the requests from the server with the correct filters
  getRequestsFromServer(): void {
    this.requestService.getDonorRequests({
      description: this.requestDescription
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.serverFilteredRequests = this.makeRequestsReadable(returnedRequests);
      },

      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }

  public makeRequestsReadable(formList: Request[]): Request[]{
    console.log(formList);
    const items = this.itemMap;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < formList.length; i++){
      const tempTime = formList[i].dateAdded;
      if (tempTime.includes('submitted a form on:')){
        formList[i].dateAdded = tempTime;
      }else{
        formList[i].dateAdded = 'submitted a form on: ' + tempTime.substring(4, 6) + '-' + tempTime.substring(6,8)
      + '-'+ tempTime.substring(0, 4);
      }
      console.log(formList[i].dateAdded);
      for (let ii = 0; ii < formList[i].selections.length; ii++){
        formList[i].selections[ii] = ' ' + items.get(formList[i].selections[ii]);
      }
    }
    return formList;
  }
  //
  public updateFilter(): void {
    this.filteredRequests = this.serverFilteredRequests;
  }
  ngOnInit(): void {
      this.getRequestsFromServer();
      this.authHypothesis = document.cookie.includes('auth_token');
  }

  ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }

  public deleteRequest(request: Request): void {
    this.requestService.deleteDonorRequest(request).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.getRequestsFromServer();
      },

      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }
  }


import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnDestroy {

  public breadcrumbs!: string;
  public breadcrumbsSub$!: Subscription;

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    this.breadcrumbsSub$ = this.getDataRouter()
                            .subscribe(({breadcrumbs}) => {
                              this.breadcrumbs = breadcrumbs
                            });
  }


  ngOnDestroy(): void {
    this.breadcrumbsSub$.unsubscribe();
  }


  getDataRouter() {
    return this.router.events
      .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),  // filtra solo los que son ActivationEnd 
        filter((event:ActivationEnd) => event.snapshot.firstChild === null ),
        map((event:ActivationEnd) => event.snapshot.data)
        );
  }


}

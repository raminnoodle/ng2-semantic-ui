import { Component } from "@angular/core";
import { CalendarView, CalendarViewType } from "./calendar-view";
import { SuiLocalizationService } from "../../util/services/localization.service";
import { CalendarMinutesItem } from "../directives/calendar-item";
import { Util } from "../../util/util";

@Component({
    selector: "sui-calendar-minute-view",
    template: `
<table class="ui celled center aligned unstackable table three column minute">
<thead>
    <tr>
        <th colspan="4">
            <span class="link" (click)="zoomOut()">{{ date }}</span>
            <span class="prev link" (click)="prevDateRange()">
                <i class="chevron left icon"></i>
            </span>
            <span class="next link" (click)="nextDateRange()">
                <i class="chevron right icon"></i>
            </span>
        </th>
    </tr>
</thead>
<tbody>
    <tr *ngFor="let group of groupedItems">
        <td class="link"
            *ngFor="let item of group"
            [calendarItem]="item"
            (click)="setDate(item)">{{ item.humanReadable }}
        </td>
    </tr>
</tbody>
</table>
`
})
export class SuiCalendarMinuteView extends CalendarView {
    public get date():string {
        const month = this.localizationService
            .getValues().datepicker.months[this.renderedDate.getMonth()];
        const date = this.renderedDate.getDate();
        const year = this.renderedDate.getFullYear();

        return `${month} ${date}, ${year}`;
    }

    constructor(public localizationService:SuiLocalizationService) {
        super(CalendarViewType.Minute, 3);
    }

    public calculateItems():void {
        const dayStart = Util.Date.startOfHour(Util.Date.clone(this.renderedDate));
        this.calculatedItems = [];

        Util.Array.range(12).forEach(i => {
            const date = Util.Date.startOfMinute(Util.Date.clone(dayStart));
            date.setMinutes(i * 5);

            const hs = Util.String.padLeft(date.getHours().toString(), 2, "0");
            const ms = Util.String.padLeft(date.getMinutes().toString(), 2, "0");
            let isDisabled = false;
            if (this.service.maxDate) {
                isDisabled = isDisabled || this.service.maxDate < date;
            }
            if (this.service.minDate) {
                isDisabled = isDisabled || this.service.minDate > date;
            }
            const isActive = !!this.selectedDate && Util.Date.minutesEqual(date, this.selectedDate);

            this.calculatedItems.push(new CalendarMinutesItem(date, `${hs}:${ms}`, isDisabled, isActive, false));
        });
    }

    public nextDateRange():void {
        this.renderedDate.setDate(this.renderedDate.getDate() + 1);
        this.updateItems();
    }

    public prevDateRange():void {
        this.renderedDate.setDate(this.renderedDate.getDate() - 1);
        this.updateItems();
    }
}

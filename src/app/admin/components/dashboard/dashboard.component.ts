import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../../../services/ProductService';
import { UserManagementService } from '../../services/UserManagementService';
import { OrderManagementService } from '../../services/OrderManagementService';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/MessageService';
import { CategoryService } from '../../../services/CategoryService';
import { HttpErrorResponse } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  protected message : string | null = null;

  protected categoriesCount: number = 0;
  protected productsCount: number = 0;
  protected usersCount: number = 0;
  protected ordersCount: number = 0;
  protected pendingOrdersCount: number = -1;   // Initialized to -1 for HTML loading state
  protected acceptedOrdersCount: number = -1;  // Initialized to -1 for HTML loading state
  protected cancelledOrdersCount: number = -1; // Initialized to -1 for HTML loading state

  // Use a private backing field for canvasRef
  private _canvasRef: ElementRef<HTMLCanvasElement> | undefined;
  // Use a setter for the @ViewChild to react when the element becomes available
  @ViewChild('orderStatusChart', { static: false })
  set canvasSetter(element: ElementRef<HTMLCanvasElement> | undefined) {
    this._canvasRef = element;
    // As soon as the canvas element is available, attempt to render the chart.
    // A setTimeout(0) here ensures the call happens after Angular's change detection cycle completes.
    if (this._canvasRef) {
      setTimeout(() => {
        this.renderOrderChart();
      }, 0);
    }
  }

  // Provide a getter to access canvasRef elsewhere if needed
  /*
  get canvasRef(): ElementRef<HTMLCanvasElement> | undefined {
    return this._canvasRef;
  }
   */

  private orderChart: Chart | undefined; // To store the chart instance

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private _userManagementService: UserManagementService,
              private _orderManagementService: OrderManagementService) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._categoryService.getAllCategories().subscribe({
      next: response => {
        this.categoriesCount = response.length;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    });

    this._productService.getAllProducts().subscribe({
      next: response => {
        this.productsCount = response.length;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    });

    this._userManagementService.getAllUsers().subscribe({
      next: response => {
        this.usersCount = response.length;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    });

    this._orderManagementService.getOrdersStats().subscribe({
      next: response => {
        this.ordersCount = response.totalNumberOfOrders;
        this.pendingOrdersCount = response.pendingOrdersCount;
        this.acceptedOrdersCount = response.acceptedOrdersCount;
        this.cancelledOrdersCount = response.cancelledOrdersCount;

        // No need for setTimeout here. The @ViewChild setter will handle calling renderOrderChart
        // once the canvas is available in the DOM due to the updated counts.
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    });
  }

  // ngAfterViewInit is called once, after the component's view has been initialized.
  // With the @ViewChild setter, direct calls to renderOrderChart from here are often not needed,
  // but keeping it minimal for lifecycle completeness.
  ngAfterViewInit(): void {
    // No direct chart rendering here. The @ViewChild setter or data subscription will handle it.
  }

  private renderOrderChart(): void {
    // This check is now redundant because the setter-only calls renderOrderChart if _canvasRef is present.
    // However, it's good practice to keep defensive checks for potential race conditions.
    if (!this._canvasRef || !this._canvasRef.nativeElement) {
      console.warn('Canvas element is unexpectedly not available. Chart rendering skipped.');
      return;
    }

    // Only render the chart if there's actual *meaningful* data to display.
    // The HTML's @else if (pendingOrdersCount > 0 || ...) already handles not displaying the canvas itself,
    // so this is a final safeguard for zero data.
    if (this.pendingOrdersCount === 0 && this.acceptedOrdersCount === 0 && this.cancelledOrdersCount === 0) {
      console.warn('No order data (all counts are zero). Skipping chart render or destroying existing chart.');
      // Destroy existing chart if data becomes all zero
      if (this.orderChart) {
        this.orderChart.destroy();
        this.orderChart = undefined; // Clear the reference
      }
      return;
    }

    const ctx = this._canvasRef.nativeElement.getContext('2d'); // Use _canvasRef

    if (!ctx) {
      console.error('Could not get 2D rendering context from canvas.');
      return;
    }

    // Destroy existing chart instance if it exists to prevent duplicates or errors
    if (this.orderChart) {
      this.orderChart.destroy();
    }

    this.orderChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Accepted', 'Cancelled'],
        datasets: [{
          label: 'Order Status',
          data: [
            this.pendingOrdersCount,
            this.acceptedOrdersCount,
            this.cancelledOrdersCount
          ],
          backgroundColor: [
            'rgba(13, 110, 253, 0.6)', // Indigo
            'rgba(25, 135, 84, 0.6)',  // Green
            'rgba(212, 51, 51, 0.6)'   // Red
          ],
          borderColor: [
            'rgba(13, 110, 253, 1)',
            'rgba(25, 135, 84, 1)',
            'rgba(212, 51, 51, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // This makes the chart respect the container's dimensions
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}`;
              }
            }
          },
          title: {
            display: true,
            text: 'Order Status Distribution'
          }
        }
      }
    });
  }
}

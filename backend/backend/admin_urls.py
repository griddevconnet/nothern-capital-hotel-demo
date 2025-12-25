from django.urls import include, path

urlpatterns = [
    path('', include('bookings.admin_urls')),
]

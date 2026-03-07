from django.db import models


class Court(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField(default=10)
    image = models.ImageField(upload_to='courts/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courts'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class TimeSlot(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    court = models.ForeignKey(Court, on_delete=models.CASCADE, related_name='time_slots')
    start_time = models.TimeField()
    end_time = models.TimeField()
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'time_slots'
        unique_together = ['court', 'day_of_week', 'start_time', 'end_time']

    def __str__(self):
        return f"{self.court.name} - {self.get_day_of_week_display()} {self.start_time} to {self.end_time}"

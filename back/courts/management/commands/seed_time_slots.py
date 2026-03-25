from django.core.management.base import BaseCommand
from courts.models import Court, TimeSlot
from datetime import time


class Command(BaseCommand):
    help = 'Create time slots for all courts'

    def handle(self, *args, **options):
        courts = Court.objects.all()
        if not courts:
            self.stdout.write(self.style.WARNING('No courts found. Run seed_courts first.'))
            return

        # Time slots from 9 AM to 10 PM
        time_slots = [
            (time(9, 0), time(10, 0)),
            (time(10, 0), time(11, 0)),
            (time(11, 0), time(12, 0)),
            (time(12, 0), time(13, 0)),
            (time(13, 0), time(14, 0)),
            (time(14, 0), time(15, 0)),
            (time(15, 0), time(16, 0)),
            (time(16, 0), time(17, 0)),
            (time(17, 0), time(18, 0)),
            (time(18, 0), time(19, 0)),
            (time(19, 0), time(20, 0)),
            (time(20, 0), time(21, 0)),
            (time(21, 0), time(22, 0)),
        ]

        for court in courts:
            for day in range(7):  # Monday to Sunday
                for start_time, end_time in time_slots:
                    slot, created = TimeSlot.objects.get_or_create(
                        court=court,
                        day_of_week=day,
                        start_time=start_time,
                        end_time=end_time,
                        defaults={'is_available': True}
                    )
                    if created:
                        self.stdout.write(f'Created slot: {court.name} - Day {day} - {start_time}')

        self.stdout.write(self.style.SUCCESS('Done seeding time slots.'))
from django.core.management.base import BaseCommand
from courts.models import Court


class Command(BaseCommand):
    help = 'Create sample futsal courts for development'

    def handle(self, *args, **options):
        courts_data = [
            {'name': 'Elite Futsal Arena', 'location': 'Downtown', 'description': 'Premium futsal court with excellent facilities', 'price_per_hour': 50, 'capacity': 10, 'image_url': 'https://via.placeholder.com/400x300?text=Elite+Futsal+Arena'},
            {'name': 'Pro Futsal Center', 'location': 'City Center', 'description': 'Professional grade futsal court', 'price_per_hour': 45, 'capacity': 10, 'image_url': 'https://via.placeholder.com/400x300?text=Pro+Futsal+Center'},
            {'name': 'Champions Futsal', 'location': 'Sports Complex', 'description': 'Top-tier futsal facility', 'price_per_hour': 55, 'capacity': 10, 'image_url': 'https://via.placeholder.com/400x300?text=Champions+Futsal'},
        ]
        for data in courts_data:
            court, created = Court.objects.get_or_create(name=data['name'], defaults=data)
            self.stdout.write(self.style.SUCCESS(f'{"Created" if created else "Exists"}: {court.name}'))
        self.stdout.write(self.style.SUCCESS('Done seeding courts.'))

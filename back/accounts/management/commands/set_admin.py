from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Set a user as admin'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email of the user to make admin')

    def handle(self, *args, **options):
        email = options['email'].lower()
        try:
            user = User.objects.get(email__iexact=email)
            user.is_admin = True
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ User {email} is now admin\n'
                    f'   - is_admin: {user.is_admin}\n'
                    f'   - is_staff: {user.is_staff}\n'
                    f'   - is_superuser: {user.is_superuser}'
                )
            )
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'❌ User with email {email} not found')
            )

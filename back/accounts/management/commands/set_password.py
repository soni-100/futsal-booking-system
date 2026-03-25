from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import User


class Command(BaseCommand):
    help = 'Set password for a user'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email of the user')
        parser.add_argument('password', type=str, help='New password')

    def handle(self, *args, **options):
        email = options['email'].lower()
        password = options['password']

        if len(password) < 8:
            self.stdout.write(
                self.style.ERROR('❌ Password must be at least 8 characters long')
            )
            return

        try:
            user = User.objects.get(email__iexact=email)
            user.set_password(password)
            user.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Password updated for {email}\n'
                    f'   You can now login with this new password'
                )
            )
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'❌ User with email {email} not found')
            )

class ApplicationController < ActionController::API
  before_action :check_header_info
  rescue_from Api::V1::Exceptions::Error, with: :api_error

  private

  def api_error(error)
    render json: {
      message: error.title,
      errors: [
        {
          code: error.code,
          status: error.status,
          title: error.title,
          detail: error.detail,
          href: error.href
        }
      ]
    }, status: error.status
  end

  def check_header_info
    raise Api::V1::Exceptions::WrongContentTypeError if request.headers["Content-Type"] != "application/vnd.api+json"
    raise Api::V1::Exceptions::WrongAcceptError if request.headers["Accept"] != "application/vnd.api+json"
  end
end

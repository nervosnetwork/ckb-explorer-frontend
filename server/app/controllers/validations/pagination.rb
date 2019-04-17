module Validations
  class Pagination
    include ActiveModel::Validations

    validates :page, numericality: { only_integer: true }, allow_nil: true
    validates :page_size, numericality: { only_integer: true }, allow_nil: true

    def initialize(params = {})
      @page = params[:page]
      @page_size = params[:page_size]
    end

    def error_object
      api_errors = []

      if invalid?
        api_errors << Api::V1::Exceptions::PageParamError.new if :page.in?(errors.keys)
        api_errors << Api::V1::Exceptions::PageSizeParamError.new if :page_size.in?(errors.keys)
        {
          status: api_errors.first.status,
          errors: RequestErrorSerializer.new(api_errors, message: api_errors.first.title)
        }
      end
    end

    private

    attr_accessor :page, :page_size
  end
end
